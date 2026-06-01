import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base/baseController';
import { BlogUseCase } from './use-case';

export class BlogController extends BaseController {
  private blogUseCase: BlogUseCase;

  constructor(blogUseCase = new BlogUseCase()) {
    super();
    this.blogUseCase = blogUseCase;
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const blogs = await this.blogUseCase.getAllBlogs(req.organizationId!);
      this.sendSuccess(res, blogs, 'Articles récupérés avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const blog = await this.blogUseCase.getBlogById(req.params.id, req.organizationId!);
      this.sendSuccess(res, blog, 'Article récupéré avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const blog = await this.blogUseCase.createBlog(req.organizationId!, req.user!.id, req.body);
      this.sendCreated(res, blog, 'Article créé avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const blog = await this.blogUseCase.updateBlog(req.params.id, req.organizationId!, req.body);
      this.sendSuccess(res, blog, 'Article mis à jour avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.blogUseCase.deleteBlog(req.params.id, req.organizationId!);
      this.sendSuccess(res, null, 'Article supprimé avec succès.');
    } catch (error) {
      next(error);
    }
  };
}

export default BlogController;
