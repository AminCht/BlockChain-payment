import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyService],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getCurrencies',()=>{
    it('should return all currencies',()=>{

    })
  })
  describe('getCurrencies by id',()=>{
    it('should return a currency',()=>{

    })
  })
  describe('add currency',()=>{
    it('should add a currency',()=>{

    })
  })
  describe('update currency',()=>{
    it('should update a currency',()=>{

    })
  })
  describe('delete currency',()=>{
    it('should delete a currency',()=>{

    });
});
