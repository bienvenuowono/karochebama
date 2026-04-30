import prisma from '../../../config/prisma';

export class ProductRepository {
  async findAll(filters: any) {
    const { regionId, zoneId, typeId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (typeId) where.typeId = parseInt(typeId);
    
    if (zoneId || regionId) {
      where.zones = {
        some: {
          zone: {
            id: zoneId ? parseInt(zoneId) : undefined,
            sites: regionId ? {
              some: {
                site: { regionId: parseInt(regionId) }
              }
            } : undefined
          }
        }
      };
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          type: true,
          variety: { include: { category: true } },
          site: { include: { region: true } },
          category: true,
          zones: { include: { zone: true } }
        },
        skip,
        take: parseInt(limit.toString()),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return { items, total, page, limit };
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        type: true,
        variety: true,
        site: true,
        category: true,
        zones: { include: { zone: true } }
      }
    });
  }

  async create(data: any) {
    const { zoneIds, ...productData } = data;
    return prisma.product.create({
      data: {
        ...productData,
        zones: {
          create: (zoneIds || []).map((id: number) => ({ zoneId: id }))
        }
      }
    });
  }

  async update(id: number, data: any) {
    const { zoneIds, ...productData } = data;
    const updateData: any = { ...productData };
    
    if (zoneIds) {
      updateData.zones = {
        deleteMany: {},
        create: zoneIds.map((id: number) => ({ zoneId: id }))
      };
    }

    return prisma.product.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: number) {
    // Suppression en cascade manuelle pour garantir l'intégrité
    return prisma.$transaction([
      prisma.harvest.deleteMany({ where: { productId: id } }),
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.productZone.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } })
    ]);
  }
}
