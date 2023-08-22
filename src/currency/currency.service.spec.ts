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
    it('should return all currencies',async()=>{
      const response = await service.getAllCurrencies();
      expect(response).not.toBeNull();
    })
  });

  describe('getCurrencies by id',()=>{
    it('should return a currency',async()=>{
      const response = await service.getCurrencyById(1);
      expect(response).not.toBeNull();
    });
  });

  describe('add currency',()=>{
    it('should add a currency',async()=>{
      const currencyDto = {network: 'ethereum', name: 'bitcoin', symbol: 'btc'}
      const response = await service.addCurrency(currencyDto);
      expect(response).not.toBeNull();
    })
  });

  describe('update currency',()=>{
    it('should update a currency',async()=>{
      const currencyDto = {network: 'ethereum', name: 'bitcoin', symbol: 'btc1'}
      const response = await service.UpdateCurrency(3, currencyDto);
      expect(response).not.toBeNull();
    });

    it('invalid currency id and retun 404',async()=>{
      try{
        const currencyDto = {network: 'ethereum', name: 'bitcoin', symbol: 'btc1'}
        await service.UpdateCurrency(20, currencyDto);
      } catch(error){
        expect(error.status).toBe(404);
      }
    });
  });

  describe('delete currency',()=>{
    it('should delete a currency',async()=>{
      const response = await service.DeleteCurrency(3);
      expect(response.message).toBe('Currency with id 3 Deleted');
    });

    it('invalid currency id and retun 404',async()=>{
      try{
        await service.DeleteCurrency(20);
      } catch(error){
        expect(error.status).toBe(404);
      }
    });
  });
});
