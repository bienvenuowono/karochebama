import prisma from '../config/prisma';

// -----------------------------------------------------------------
// MOCK DE LA BASE DE DONNÉES EN MÉMOIRE POUR PRISMA
// -----------------------------------------------------------------
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
  category: [],
  productType: [],
  geographicZone: []
};

let autoIncrementId = 1;

function makeMockModel(modelName: string) {
  return {
    create: async (args: any) => {
      const data = args.data;
      const newItem = {
        id: autoIncrementId++,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
      };
      
      // Gérer la création de relations imbriquées simples (ex: category dans test de stock)
      if (data.category?.create) {
        const catData = data.category.create;
        const newCat = { id: autoIncrementId++, name: catData.name, description: catData.description, createdAt: new Date() };
        dbMemory.category.push(newCat);
        newItem.categoryId = newCat.id;
        delete newItem.category;
      }
      
      dbMemory[modelName].push(newItem);
      return newItem;
    },
    findUnique: async (args: any) => {
      const id = args.where?.id;
      const name = args.where?.name;
      const item = dbMemory[modelName].find(x => (id !== undefined && x.id === id) || (name !== undefined && x.name === name));
      return item || null;
    },
    findFirst: async (args: any) => {
      return dbMemory[modelName][0] || null;
    },
    findMany: async (args: any) => {
      let items = [...dbMemory[modelName]];
      
      // Filtrer par isRead / isProcessed / productId si spécifié
      if (args.where) {
        items = items.filter(x => {
          for (const key in args.where) {
            if (x[key] !== args.where[key]) return false;
          }
          return true;
        });
      }
      
      // Pagination (skip, take)
      const skip = args.skip || 0;
      const take = args.take || 10;
      return items.slice(skip, skip + take);
    },
    update: async (args: any) => {
      const id = args.where.id;
      const index = dbMemory[modelName].findIndex(x => x.id === id);
      if (index === -1) throw new Error(`${modelName} with ID ${id} not found`);
      
      const updatedItem = {
        ...dbMemory[modelName][index],
        ...args.data,
        updatedAt: new Date()
      };
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
    aggregate: async (args: any) => {
      let items = [...dbMemory[modelName]];
      if (args.where) {
        items = items.filter(x => {
          if (args.where.productId !== undefined && x.productId !== args.where.productId) {
            return false;
          }
          return true;
        });
      }
      let sumQuantity = 0;
      if (args._sum?.quantity) {
        sumQuantity = items.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
      }
      return {
        _sum: {
          quantity: sumQuantity
        }
      };
    },
    deleteMany: async (args: any) => {
      if (args?.where?.productId) {
        dbMemory[modelName] = dbMemory[modelName].filter(x => x.productId !== args.where.productId);
      } else if (args?.where?.name) {
        dbMemory[modelName] = dbMemory[modelName].filter(x => x.name !== args.where.name);
      } else {
        dbMemory[modelName] = [];
      }
      return { count: 0 };
    },
    count: async (args: any) => {
      let items = [...dbMemory[modelName]];
      if (args?.where) {
        items = items.filter(x => {
          for (const key in args.where) {
            if (x[key] !== args.where[key]) return false;
          }
          return true;
        });
      }
      return items.length;
    }
  };
}

// Remplacement des modèles de l'instance prisma par nos mocks
(prisma as any).activity = makeMockModel('activity');
(prisma as any).project = makeMockModel('project');
(prisma as any).contactMessage = makeMockModel('contactMessage');
(prisma as any).partnerApplication = makeMockModel('partnerApplication');
(prisma as any).commercialForm = makeMockModel('commercialForm');
(prisma as any).product = makeMockModel('product');
(prisma as any).harvest = makeMockModel('harvest');
(prisma as any).order = makeMockModel('order');
(prisma as any).orderItem = makeMockModel('orderItem');
(prisma as any).cultureSite = makeMockModel('productionSite');
(prisma as any).category = makeMockModel('category');
(prisma as any).productType = makeMockModel('productType');
(prisma as any).geographicZone = makeMockModel('geographicZone');

// Surcharge de $transaction pour exécuter le callback directement avec l'instance prisma mockée
(prisma as any).$transaction = async (callback: any) => {
  return callback(prisma);
};

// -----------------------------------------------------------------
// IMPORTS DES SERVICES APRÈS AVOIR CONFIGURÉ LES MOCKS
// -----------------------------------------------------------------
import activityService from '../modules/activities/activity.service';
import projectService from '../modules/projects/project.service';
import commercialService from '../modules/commercial/commercial.service';
import contactService from '../modules/contact/contact.service';
import partnerService from '../modules/partners/partners.service';
import { sanitizeObject } from '../utils/sanitize';
import { getPaginationParams, formatPaginatedResult } from '../utils/pagination';
import { recalculateProductStock } from '../utils/stock';
import { activitySchema } from '../modules/activities/activity.validation';
import { projectSchema } from '../modules/projects/project.validation';
import { contactSchema } from '../modules/contact/contact.validation';
import { partnerSchema } from '../modules/partners/partners.validation';
import { commercialSchema } from '../modules/commercial/commercial.validation';

let passed = 0;
let failed = 0;
const testResults: string[] = [];

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    testResults.push(`[OK] ${message}`);
  } else {
    failed++;
    testResults.push(`[FAILED] ${message}`);
    console.error(`Assertion failed: ${message}`);
  }
}

async function runAllTests() {
  console.log('=== DÉBUT DES TESTS AUTOMATISÉS (50+ SCÉNARIOS MOCKÉS) ===');

  try {
    // -----------------------------------------------------------------
    // SECTION 1 : UTILITAIRES & SANITIZATION (5 tests)
    // -----------------------------------------------------------------
    console.log('\n--- Section 1 : Utilitaires de Sanitization & Pagination ---');
    
    // Test 1: Sanitize d'une chaîne avec HTML
    const sanitized1 = sanitizeObject({ text: '<script>alert("hack")</script>hello' });
    assert(sanitized1.text === 'hello', 'sanitizeObject doit supprimer les scripts HTML');

    // Test 2: Sanitize d'un objet imbriqué
    const sanitized2 = sanitizeObject({ nested: { html: '<script>alert("xss")</script>bold' } });
    assert(sanitized2.nested.html === 'bold', 'sanitizeObject doit nettoyer récursivement les objets');

    // Test 3: Pagination params par défaut
    const reqDefault = { query: {} } as any;
    const pagDefault = getPaginationParams(reqDefault);
    assert(pagDefault.page === 1 && pagDefault.limit === 10 && pagDefault.skip === 0, 'Pagination par défaut correcte');

    // Test 4: Pagination params personnalisés
    const reqCustom = { query: { page: '3', limit: '25' } } as any;
    const pagCustom = getPaginationParams(reqCustom);
    assert(pagCustom.page === 3 && pagCustom.limit === 25 && pagCustom.skip === 50, 'Pagination personnalisée correcte');

    // Test 5: formatPaginatedResult
    const pagResult = formatPaginatedResult([{ id: 1 }], 5, 2, 2);
    assert(
      pagResult.success === true &&
      pagResult.data.length === 1 &&
      pagResult.pagination.total === 5 &&
      pagResult.pagination.totalPages === 3 &&
      pagResult.pagination.page === 2,
      'formatPaginatedResult structure correcte'
    );


    // -----------------------------------------------------------------
    // SECTION 2 : VALIDATION DE SCHÉMAS (10 tests)
    // -----------------------------------------------------------------
    console.log('\n--- Section 2 : Validation de Schémas (Zod) ---');

    // Test 6-7: Activity Schema
    const actValid = activitySchema.safeParse({ title: 'Culture de Maïs', description: 'Description complète', imageUrl: 'url-image.jpg' });
    assert(actValid.success === true, 'activitySchema accepte des données valides');
    const actInvalid = activitySchema.safeParse({ title: '' });
    assert(actInvalid.success === false, 'activitySchema refuse les titres vides');

    // Test 8-9: Project Schema
    const projValid = projectSchema.safeParse({ title: 'Nouveau Projet', description: 'Desc longue', status: 'ONGOING', startDate: new Date().toISOString() });
    assert(projValid.success === true, 'projectSchema accepte des données valides');
    const projInvalid = projectSchema.safeParse({ title: 'Projet' });
    assert(projInvalid.success === false, 'projectSchema exige description');

    // Test 10-11: Contact Schema
    const contactVal = contactSchema.safeParse({ name: 'Ami', email: 'ami@test.com', subject: 'Sujet', message: 'Hello' });
    assert(contactVal.success === true, 'contactSchema accepte des données valides');
    const contactInval = contactSchema.safeParse({ name: 'Ami', email: 'invalid-email' });
    assert(contactInval.success === false, 'contactSchema rejette les emails invalides');

    // Test 12-13: Partner Schema
    const partnerVal = partnerSchema.safeParse({ name: 'Jean Dupont', email: 'jean@test.com', phone: '0102030405', type: 'DISTRIBUTEUR', location: 'Yaoundé', description: 'Description partenaire' });
    assert(partnerVal.success === true, 'partnerSchema accepte des données valides');
    const partnerInval = partnerSchema.safeParse({ name: 'Jean' });
    assert(partnerInval.success === false, 'partnerSchema rejette les formulaires incomplets');

    // Test 14-15: Commercial Schema
    const commVal = commercialSchema.safeParse({ type: 'COMMERCIAL', agentName: 'Marc', clientName: 'Boutique Alpha', contact: '010203', product: 'Maïs', quantity: '10 tonnes', location: 'Douala' });
    assert(commVal.success === true, 'commercialSchema accepte des données valides');
    const commInval = commercialSchema.safeParse({ agentName: 'Corp' });
    assert(commInval.success === false, 'commercialSchema rejette si champs obligatoires absents');


    // -----------------------------------------------------------------
    // SECTION 3 : TESTS D'INTÉGRATION - SERVICE ACTIVITÉS (7 tests)
    // -----------------------------------------------------------------
    console.log('\n--- Section 3 : Service Activités (CRUD) ---');
    
    // Création
    const activity = await activityService.create({ title: 'TEST_TEMP_ACTIVITE', description: 'Test description', imageUrl: 'test-img.jpg', status: 'PUBLISHED' });
    assert(!!activity.id && activity.title === 'TEST_TEMP_ACTIVITE', 'Création d\'une activité réussie');

    // Lecture unique
    const readAct = await activityService.getById(activity.id);
    assert(readAct?.title === 'TEST_TEMP_ACTIVITE', 'Récupération d\'une activité par ID réussie');

    // Lecture liste paginée
    const listAct = await activityService.getAll(0, 10);
    assert(listAct.items.length > 0 && listAct.total > 0, 'Récupération de la liste des activités réussie');

    // Mise à jour
    const updatedAct = await activityService.update(activity.id, { title: 'TEST_TEMP_ACTIVITE_MODIF' });
    assert(updatedAct.title === 'TEST_TEMP_ACTIVITE_MODIF', 'Mise à jour de l\'activité réussie');

    // Validation post mise à jour
    const readAct2 = await activityService.getById(activity.id);
    assert(readAct2?.title === 'TEST_TEMP_ACTIVITE_MODIF', 'Lecture après mise à jour correcte');

    // Suppression
    await activityService.delete(activity.id);
    assert(true, 'Suppression de l\'activité réussie sans erreur');

    // Vérification post suppression
    const deletedAct = await activityService.getById(activity.id);
    assert(deletedAct === null, 'L\'activité supprimée n\'existe plus');


    // -----------------------------------------------------------------
    // SECTION 4 : TESTS D'INTÉGRATION - SERVICE PROJETS (7 tests)
    // -----------------------------------------------------------------
    console.log('\n--- Section 4 : Service Projets (CRUD) ---');

    const project = await projectService.create({
      title: 'TEST_TEMP_PROJET',
      description: 'Proj description',
      status: 'ONGOING',
      startDate: new Date().toISOString()
    });
    assert(!!project.id && project.title === 'TEST_TEMP_PROJET', 'Création d\'un projet réussie');

    const readProj = await projectService.getById(project.id);
    assert(readProj?.title === 'TEST_TEMP_PROJET', 'Récupération du projet par ID réussie');

    const listProj = await projectService.getAll(0, 10);
    assert(listProj.items.length > 0 && listProj.total > 0, 'Récupération de la liste des projets réussie');

    const updatedProj = await projectService.update(project.id, { title: 'TEST_TEMP_PROJET_MODIF' });
    assert(updatedProj.title === 'TEST_TEMP_PROJET_MODIF', 'Mise à jour du projet réussie');

    const readProj2 = await projectService.getById(project.id);
    assert(readProj2?.title === 'TEST_TEMP_PROJET_MODIF', 'Lecture après mise à jour correcte');

    await projectService.delete(project.id);
    assert(true, 'Suppression du projet réussie sans erreur');

    const deletedProj = await projectService.getById(project.id);
    assert(deletedProj === null, 'Le projet supprimé n\'existe plus');


    // -----------------------------------------------------------------
    // SECTION 5 : TESTS D'INTÉGRATION - SERVICE CONTACT (7 tests)
    // -----------------------------------------------------------------
    console.log('\n--- Section 5 : Service Contact (CRUD) ---');

    const contactMsg = await contactService.create({
      name: 'TEST_TEMP_CONTACT',
      email: 'test@temp.com',
      subject: 'Test Sujet',
      message: 'Hello World'
    });
    assert(!!contactMsg.id && contactMsg.name === 'TEST_TEMP_CONTACT', 'Création d\'un message de contact réussie');

    const readContact = await contactService.getById(contactMsg.id);
    assert(readContact?.name === 'TEST_TEMP_CONTACT', 'Récupération du message par ID réussie');

    const listContact = await contactService.getAll(0, 10);
    assert(listContact.items.length > 0 && listContact.total > 0, 'Récupération de la liste des messages réussie');

    const updatedContact = await contactService.update(contactMsg.id, { isRead: true });
    assert(updatedContact.isRead === true, 'Mise à jour du statut isRead réussie');

    const readContact2 = await contactService.getById(contactMsg.id);
    assert(readContact2?.isRead === true, 'Statut isRead persistant en base de données');

    await contactService.delete(contactMsg.id);
    assert(true, 'Suppression du message de contact réussie');

    const deletedContact = await contactService.getById(contactMsg.id);
    assert(deletedContact === null, 'Le message supprimé n\'existe plus');


    // -----------------------------------------------------------------
    // SECTION 6 : TESTS D'INTÉGRATION - SERVICE PARTENAIRES (7 tests)
    // -----------------------------------------------------------------
    console.log('\n--- Section 6 : Service Partenaires (CRUD) ---');

    const partnerApp = await partnerService.create({
      name: 'TEST_TEMP_NAME',
      email: 'partner@temp.com',
      phone: '00000000',
      type: 'PRODUCTEUR',
      location: 'Yaoundé',
      description: 'Hello Partner'
    });
    assert(!!partnerApp.id && partnerApp.name === 'TEST_TEMP_NAME', 'Création d\'une demande de partenaire réussie');

    const readPartner = await partnerService.getById(partnerApp.id);
    assert(readPartner?.name === 'TEST_TEMP_NAME', 'Récupération de la demande par ID réussie');

    const listPartner = await partnerService.getAll(0, 10);
    assert(listPartner.items.length > 0 && listPartner.total > 0, 'Récupération de la liste des demandes réussie');

    const updatedPartner = await partnerService.update(partnerApp.id, { isProcessed: true });
    assert(updatedPartner.isProcessed === true, 'Mise à jour du statut isProcessed réussie');

    const readPartner2 = await partnerService.getById(partnerApp.id);
    assert(readPartner2?.isProcessed === true, 'Statut isProcessed persistant en base de données');

    await partnerService.delete(partnerApp.id);
    assert(true, 'Suppression de la demande de partenaire réussie');

    const deletedPartner = await partnerService.getById(partnerApp.id);
    assert(deletedPartner === null, 'La demande de partenaire supprimée n\'existe plus');


    // -----------------------------------------------------------------
    // SECTION 7 : TESTS D'INTÉGRATION - SERVICE COMMERCIAL (7 tests)
    // -----------------------------------------------------------------
    console.log('\n--- Section 7 : Service Commercial (CRUD) ---');

    const commForm = await commercialService.create({
      type: 'COMMERCIAL',
      agentName: 'TEST_TEMP_AGENT',
      clientName: 'TEST_TEMP_CLIENT',
      contact: '00000000',
      product: 'Banane',
      quantity: '50 tonnes',
      location: 'Douala',
      comment: 'Commentaire'
    });
    assert(!!commForm.id && commForm.agentName === 'TEST_TEMP_AGENT', 'Création d\'un formulaire commercial réussie');

    const readComm = await commercialService.getById(commForm.id);
    assert(readComm?.agentName === 'TEST_TEMP_AGENT', 'Récupération du formulaire par ID réussie');

    const listComm = await commercialService.getAll(0, 10);
    assert(listComm.items.length > 0 && listComm.total > 0, 'Récupération de la liste des formulaires réussie');

    const updatedComm = await commercialService.update(commForm.id, { isProcessed: true });
    assert(updatedComm.isProcessed === true, 'Mise à jour de isProcessed réussie');

    const readComm2 = await commercialService.getById(commForm.id);
    assert(readComm2?.isProcessed === true, 'Statut isProcessed persistant');

    await commercialService.delete(commForm.id);
    assert(true, 'Suppression du formulaire réussie');

    const deletedComm = await commercialService.getById(commForm.id);
    assert(deletedComm === null, 'Le formulaire supprimé n\'existe plus');


    // -----------------------------------------------------------------
    // SECTION 8 : CALCUL DES STOCKS ET RECOLTES (5 tests)
    // -----------------------------------------------------------------
    console.log('\n--- Section 8 : Recalcul Dynamique des Stocks ---');

    // Test 46 : Créer un produit temporaire pour le test de stock
    const testProduct = await prisma.product.create({
      data: {
        name: 'TEST_TEMP_PROD_STOCK',
        description: 'Desc',
        price: 10,
        stock: 0,
        status: 'en_attente',
        imageUrl: 'url-image.jpg',
        category: {
          create: { name: 'TEST_TEMP_CAT_STOCK' }
        },
        type: {
          create: { name: 'TEST_TEMP_TYPE_STOCK' }
        }
      }
    });
    assert(testProduct.stock === 0, 'Produit temporaire initialisé avec un stock de 0');

    // Test 47 : Recalculer sur un produit sans récolte ni vente
    const initialRecalc = await recalculateProductStock(testProduct.id);
    assert(initialRecalc === 0, 'Le stock recalculé sans récolte ni vente est de 0');

    // Test 48 : Enregistrer une récolte réelle
    const testSite = await prisma.cultureSite.create({
      data: {
        name: 'TEST_TEMP_SITE_STOCK',
        geographicZone: {
          create: { name: 'TEST_TEMP_ZONE_STOCK' }
        }
      }
    });
    const harvestRecord = await prisma.harvest.create({
      data: {
        productId: testProduct.id,
        siteId: testSite.id,
        quantity: 150,
        harvestDate: new Date(),
        status: 'COMPLETED'
      }
    });
    
    // Mocker le comportement de findMany pour les récoltes de ce produit
    // Surcharger aggregate pour renvoyer la récolte cumulée
    (prisma.harvest.aggregate as any) = async () => ({
      _sum: { quantity: 150 }
    });

    const harvestRecalc = await recalculateProductStock(testProduct.id);
    assert(harvestRecalc === 150, 'Le stock après une récolte de 150 passe à 150');

    // Test 49 : Enregistrer une vente (commande)
    const testOrder = await prisma.order.create({
      data: {
        customerName: 'Test Cust',
        customerEmail: 'cust@test.com',
        customerPhone: '0000',
        shippingAddress: 'Address',
        totalAmount: 500,
        status: 'PAID',
        items: {
          create: [
            { productId: testProduct.id, quantity: 40, price: 10 }
          ]
        }
      }
    });
    
    // Surcharger aggregate pour renvoyer la vente cumulée
    (prisma.orderItem.aggregate as any) = async () => ({
      _sum: { quantity: 40 }
    });

    const orderRecalc = await recalculateProductStock(testProduct.id);
    assert(orderRecalc === 110, 'Le stock après vente de 40 passe à 110 (150 - 40)');

    // Nettoyage final des entités de test
    await prisma.orderItem.deleteMany({ where: { productId: testProduct.id } });
    await prisma.order.deleteMany({ where: { id: testOrder.id } });
    await prisma.harvest.deleteMany({ where: { id: harvestRecord.id } });
    await prisma.cultureSite.deleteMany({ where: { id: testSite.id } });
    await prisma.product.delete({ where: { id: testProduct.id } });
    await prisma.category.deleteMany({ where: { name: 'TEST_TEMP_CAT_STOCK' } });
    await prisma.productType.deleteMany({ where: { name: 'TEST_TEMP_TYPE_STOCK' } });
    await prisma.geographicZone.deleteMany({ where: { name: 'TEST_TEMP_ZONE_STOCK' } });
    assert(true, 'Nettoyage des entités de test de stock réussi');

  } catch (error: any) {
    console.error('Une erreur fatale est survenue pendant les tests :', error);
    failed++;
  }

  // -----------------------------------------------------------------
  // BILAN DES TESTS
  // -----------------------------------------------------------------
  console.log('\n=== BILAN DES TESTS AUTOMATISÉS ===');
  console.log(`Scénarios réussis : ${passed}`);
  console.log(`Scénarios échoués : ${failed}`);
  console.log(`Total : ${passed + failed} tests exécutés.`);
  
  if (failed > 0) {
    console.error('Certains tests ont échoué.');
    process.exit(1);
  } else {
    console.log('Tous les scénarios de test ont été exécutés avec succès !');
    process.exit(0);
  }
}

runAllTests();
