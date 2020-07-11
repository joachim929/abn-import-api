import { CategoryRepositoryService } from '../repositories/category-repository.service';
import { CategoryGroupRepositoryService } from '../repositories/category-group-repository.service';
import { Repository } from 'typeorm';
import { Category } from '../category.entity';
import { CategoryGroup } from '../category-group.entity';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepoService;
  let categoryGroupRepoService;
  let categoryRepository;
  let categoryGroupRepository;

  beforeEach(async () => {
    categoryRepository = new Repository<Category>()
    categoryRepoService = new CategoryRepositoryService(categoryRepoService);
    categoryGroupRepository = new Repository<CategoryGroup>();
    categoryGroupRepoService = new CategoryGroupRepositoryService(categoryGroupRepository);
    categoryService = new CategoryService(categoryRepoService, categoryGroupRepoService);
  });

  it('should create service', () => {
    expect(categoryService).toBeTruthy();
  })

  describe('getCategory', () => {
    it('should return a category', async () => {
      const categoryResponse: Partial<Category> = {
        id: 1,
        name: '123',
        description: null,
        createdAt: new Date(),
        editedAt: new Date(),
        order: 1,
      };
      const expected = {
        id: 1,
        name: '123',
        description: null,
        order: 1
      }
      jest.spyOn(categoryRepoService, 'getCategoryById').mockImplementation(() => new Promise((resolve) => resolve(categoryResponse)));
      expect(await categoryService.getCategory(1)).toEqual(expected);
    });
  })
});
