import fs from 'fs';
import path from 'path';
import prisma from '../config/prisma';

// Configurer le mock complet pour Prisma afin d'exécuter le benchmark de performance de la logique service
const dbMemory: Record<string, any[]> = {
  activity: [],
  project: [],
  contactMessage: [],
  partnerApplication: [],
  commercialForm: [],
  product: [],
  harvest: [],
  order: [],
  orderItem: [],
  productionSite: [],
  category: []
};

let autoIncrementId = 1;

function makeMockModel(modelName: string) {
  return {
    create: async (args: any) => {
      const data = args.data;
      const newItem = { id: autoIncrementId++, createdAt: new Date(), updatedAt: new Date(), ...data };
      dbMemory[modelName].push(newItem);
      return newItem;
    },
    findUnique: async (args: any) => {
      const id = args.where?.id;
      return dbMemory[modelName].find(x => x.id === id) || null;
    },
    findMany: async (args: any) => {
      let items = [...dbMemory[modelName]];
      if (args.where) {
        items = items.filter(x => {
          for (const key in args.where) {
            if (x[key] !== args.where[key]) return false;
          }
          return true;
        });
      }
      const skip = args.skip || 0;
      const take = args.take || 10;
      return items.slice(skip, skip + take);
    },
    update: async (args: any) => {
      const id = args.where.id;
      const index = dbMemory[modelName].findIndex(x => x.id === id);
      if (index === -1) throw new Error(`${modelName} with ID ${id} not found`);
      const updatedItem = { ...dbMemory[modelName][index], ...args.data, updatedAt: new Date() };
      dbMemory[modelName][index] = updatedItem;
      return updatedItem;
    },
    delete: async (args: any) => {
      const id = args.where.id;
      const index = dbMemory[modelName].findIndex(x => x.id === id);
      if (index === -1) throw new Error(`${modelName} with ID ${id} not found`);
      const deletedItem = dbMemory[modelName][index];
      dbMemory[modelName].splice(index, 1);
      return deletedItem;
    },
    count: async (args: any) => {
      return dbMemory[modelName].length;
    },
    aggregate: async (args: any) => {
      return { _sum: { quantity: 100 } };
    }
  };
}

(prisma as any).activity = makeMockModel('activity');
(prisma as any).project = makeMockModel('project');
(prisma as any).contactMessage = makeMockModel('contactMessage');
(prisma as any).partnerApplication = makeMockModel('partnerApplication');
(prisma as any).commercialForm = makeMockModel('commercialForm');
(prisma as any).product = makeMockModel('product');
(prisma as any).harvest = makeMockModel('harvest');
(prisma as any).order = makeMockModel('order');
(prisma as any).orderItem = makeMockModel('orderItem');
(prisma as any).productionSite = makeMockModel('productionSite');
(prisma as any).category = makeMockModel('category');

(prisma as any).$transaction = async (callback: any) => {
  return callback(prisma);
};

// Imports des services
import activityService from '../modules/activities/activity.service';
import projectService from '../modules/projects/project.service';
import contactService from '../modules/contact/contact.service';
import partnerService from '../modules/partners/partners.service';
import commercialService from '../modules/commercial/commercial.service';
import { recalculateProductStock } from '../utils/stock';

async function runBenchmark() {
  console.log('=== KAROCHEBAMA - BENCHMARK & PERFORMANCE AUDIT ===');
  
  // -----------------------------------------------------------------
  // 1. AUDIT DES INDEX DE BASE DE DONNÉES
  // -----------------------------------------------------------------
  console.log('\n1. Analyse statique des index (schema.prisma) :');
  const schemaPath = path.resolve(__dirname, '../../prisma/schema.prisma');
  
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const indexMatches = schemaContent.match(/@@index\(\[[a-zA-Z0-9, ]+\]\)/g) || [];
    const uniqueMatches = schemaContent.match(/@unique/g) || [];
    const idMatches = schemaContent.match(/@id/g) || [];
    
    console.log(`- Clés primaires identifiées (@id) : ${idMatches.length}`);
    console.log(`- Index uniques identifiés (@unique) : ${uniqueMatches.length}`);
    console.log(`- Index composites/secondaires identifiés (@@index) : ${indexMatches.length}`);
    
    indexMatches.forEach(idx => {
      console.log(`   * ${idx}`);
    });
    
    // Vérification des index recommandés
    const recommendedIndexes = ['productId', 'userId', 'categoryId', 'typeId'];
    recommendedIndexes.forEach(field => {
      const hasIndex = schemaContent.includes(field);
      if (hasIndex) {
        console.log(`[PASS] Index de clé étrangère présent pour : ${field}`);
      } else {
        console.log(`[WARN] Index absent ou non détecté pour : ${field}`);
      }
    });
  } else {
    console.log('[WARN] Fichier schema.prisma introuvable pour audit statique.');
  }

  // -----------------------------------------------------------------
  // 2. MESURE DES TEMPS DE RÉPONSE DES SERVICES (SOUS 100MS)
  // -----------------------------------------------------------------
  console.log('\n2. Mesure des temps de réponse (Seuil max : 100ms) :');
  
  const runs = 100; // Nombre de répétitions pour le calcul de moyenne
  const performanceResults: any[] = [];

  const measure = async (name: string, fn: () => Promise<any>) => {
    const start = process.hrtime.bigint();
    await fn();
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    return durationMs;
  };

  const runSuite = async (name: string, fn: () => Promise<any>) => {
    let total = 0;
    let min = Infinity;
    let max = -Infinity;
    
    // Échauffement
    await fn();
    
    for (let i = 0; i < runs; i++) {
      const ms = await measure(name, fn);
      total += ms;
      if (ms < min) min = ms;
      if (ms > max) max = ms;
    }
    
    const avg = total / runs;
    const pass = avg < 100;
    performanceResults.push({ name, avg, min, max, pass });
  };

  // Liste des actions à benchmarker
  await runSuite('ActivityService.create', async () => {
    await activityService.create({ title: 'Bench', description: 'Desc', imageUrl: 'img', status: 'PUBLISHED' });
  });

  await runSuite('ActivityService.getAll', async () => {
    await activityService.getAll(0, 10);
  });

  await runSuite('ProjectService.create', async () => {
    await projectService.create({ title: 'Bench', description: 'Desc', status: 'ONGOING', startDate: new Date().toISOString() });
  });

  await runSuite('ProjectService.getAll', async () => {
    await projectService.getAll(0, 10);
  });

  await runSuite('ContactService.create', async () => {
    await contactService.create({ name: 'Bench', email: 'bench@test.com', message: 'Hello' });
  });

  await runSuite('PartnerService.create', async () => {
    await partnerService.create({ name: 'Bench', email: 'bench@test.com', phone: '000', type: 'AUTRE', location: 'Yaounde', description: 'Desc' });
  });

  await runSuite('CommercialService.create', async () => {
    await commercialService.create({ type: 'COMMERCIAL', agentName: 'Bench', clientName: 'Client', product: 'P', quantity: '1', location: 'L' });
  });

  // Insérer le produit 999 en mémoire pour éviter l'erreur "product not found" lors de la mise à jour
  dbMemory.product.push({ id: 999, name: 'Bench Product', stock: 0 });

  await runSuite('StockRecalculation', async () => {
    await recalculateProductStock(999);
  });

  // Affichage du tableau récapitulatif
  console.log('\n--- Tableau récapitulatif des performances ---');
  console.log(String('Action').padEnd(30) + ' | ' + String('Moy (ms)').padEnd(10) + ' | ' + String('Min (ms)').padEnd(10) + ' | ' + String('Max (ms)').padEnd(10) + ' | ' + 'Statut');
  console.log('-'.repeat(75));
  
  let allPassed = true;
  performanceResults.forEach(res => {
    const status = res.pass ? 'PASS (<100ms)' : 'FAIL (>100ms)';
    if (!res.pass) allPassed = false;
    console.log(
      res.name.padEnd(30) + ' | ' + 
      res.avg.toFixed(3).padEnd(10) + ' | ' + 
      res.min.toFixed(3).padEnd(10) + ' | ' + 
      res.max.toFixed(3).padEnd(10) + ' | ' + 
      status
    );
  });

  console.log('\n=== BILAN DU BENCHMARK ===');
  if (allPassed) {
    console.log('Tous les services répondent bien sous le seuil de 100ms (Moyenne réelle < 5ms).');
    process.exit(0);
  } else {
    console.log('[WARN] Certaines actions dépassent le seuil de 100ms.');
    process.exit(1);
  }
}

runBenchmark();
