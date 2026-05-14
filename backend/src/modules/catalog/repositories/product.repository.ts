import prisma from '../../../config/prisma';

export class ProductRepository {
  async findAll(filters: any) {
    const { zoneId, typeId, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (typeId) where.typeId = parseInt(typeId);
    
    if (zoneId) {
      where.sites = {
        some: {
          site: {
            geographicZoneId: parseInt(zoneId)
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
          sites: { include: { site: { include: { geographicZone: true } } } },
          category: true,
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
        sites: { include: { site: true } },
        category: true,
      }
    });
  }

  async create(data: any) {
    const { siteIds, ...productData } = data;
    return prisma.product.create({
      data: {
        ...productData,
        sites: {
          create: (siteIds || []).map((id: number) => ({ siteId: id }))
        }
      }
    });
  }

  async update(id: number, data: any) {
    const { siteIds, ...productData } = data;
    const updateData: any = { ...productData };
    
    if (siteIds) {
      updateData.sites = {
        deleteMany: {},
        create: siteIds.map((id: number) => ({ siteId: id }))
      };
    }

    return prisma.product.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: number) {
    return prisma.$transaction([
      prisma.harvest.deleteMany({ where: { productId: id } }),
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.productSite.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } })
    ]);
  }
}
