import { PrismaClient } from '@prisma/client';
import prisma from '../../../config/prisma';

export class ProductionZoneRepository {
  async findAll() {
    return prisma.productionZone.findMany({
      include: {
        sites: { include: { site: { include: { region: true } } } },
        crops: true
      }
    });
  }

  async create(data: any) {
    const { siteIds, ...zoneData } = data;
    return prisma.productionZone.create({
      data: {
        ...zoneData,
        sites: {
          create: siteIds.map((id: number) => ({ siteId: id }))
        }
      }
    });
  }

  async assignToSite(zoneId: number, siteId: number) {
    return prisma.siteZone.create({
      data: { zoneId, siteId }
    });
  }

  async findByRegion(regionId: number) {
    return prisma.productionZone.findMany({
      where: {
        sites: {
          some: {
            site: { regionId }
          }
        }
      },
      include: { crops: true }
    });
  }
}
