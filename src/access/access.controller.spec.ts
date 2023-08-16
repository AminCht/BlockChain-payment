import { Test, TestingModule } from '@nestjs/testing';
import { AccessController } from './access.controller';

describe('AccessController', () => {
  let controller: AccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessController],
    }).compile();

    controller = module.get<AccessController>(AccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return all tokens', ()=>{
    expect(tokens).toBeDefined();
  }
  it('should return user tokens', () => {
    expect (user.tokens).toBeDefined()
  }
  it('should return all users with there accesses', () => {
    expect (accesses).toBeDefined()
  }

});
