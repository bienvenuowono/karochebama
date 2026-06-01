import { BlogRepository } from './repository';
import { NotFoundError, BadRequestError } from '../../core/errors/appError';

export class BlogUseCase {
  private blogRepository: BlogRepository;

  constructor(blogRepository = new BlogRepository()) {
    this.blogRepository = blogRepository;
  }

  public async getAllBlogs(organizationId: string) {
    return this.blogRepository.findAll(organizationId);
  }

  public async getBlogById(id: string, organizationId: string) {
    const blog = await this.blogRepository.findById(id, organizationId);
    if (!blog) {
      throw new NotFoundError('Article introuvable');
    }
    return blog;
  }

  /**
   * Générateur de Slug pour le SEO
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD') // Sépare les accents des lettres
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplace les espaces et caractères spéciaux par des tirets
      .replace(/(^-|-$)+/g, ''); // Enlève les tirets au début et à la fin
  }

  public async createBlog(organizationId: string, authorId: string, input: any) {
    const slug = this.generateSlug(input.title);

    // Vérifier que le slug est unique pour cette organisation
    const existing = await this.blogRepository.findBySlug(slug, organizationId);
    if (existing) {
      throw new BadRequestError('Un article avec un titre similaire existe déjà. Modifiez le titre pour éviter les doublons SEO.');
    }

    const data = {
      ...input,
      slug,
      authorId,
    };

    return this.blogRepository.create(data, organizationId);
  }

  public async updateBlog(id: string, organizationId: string, input: any) {
    const blog = await this.blogRepository.findById(id, organizationId);
    if (!blog) {
      throw new NotFoundError('Article introuvable');
    }

    const data = { ...input };

    // Si on modifie le titre, on regénère le slug
    if (data.title) {
      data.slug = this.generateSlug(data.title);
      const existing = await this.blogRepository.findBySlug(data.slug, organizationId);
      // S'assurer que le slug n'appartient pas à un AUTRE article
      if (existing && existing.id !== id) {
        throw new BadRequestError('Un autre article possède déjà ce titre (conflit de slug).');
      }
    }

    return this.blogRepository.update(id, data, organizationId);
  }

  public async deleteBlog(id: string, organizationId: string) {
    const blog = await this.blogRepository.findById(id, organizationId);
    if (!blog) {
      throw new NotFoundError('Article introuvable');
    }
    await this.blogRepository.softDelete(id, organizationId);
  }
}

export default BlogUseCase;
