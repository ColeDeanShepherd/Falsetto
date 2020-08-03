import { generateValueCombinationBitMasks } from "./Utils";

enum TestEnum {
  Value1,
  Value2,
  Value3
}

test("generateValueCombinationBitMasks", () => {
  const generator = generateValueCombinationBitMasks([TestEnum.Value2, TestEnum.Value3]);

  let generatorResult = generator.next();
  expect(generatorResult.done).toBeFalsy();
  expect(generatorResult.value).toEqual(0b00);
  
  generatorResult = generator.next();
  expect(generatorResult.done).toBeFalsy();
  expect(generatorResult.value).toEqual(0b01);
  
  generatorResult = generator.next();
  expect(generatorResult.done).toBeFalsy();
  expect(generatorResult.value).toEqual(0b10);
  
  generatorResult = generator.next();
  expect(generatorResult.done).toBeFalsy();
  expect(generatorResult.value).toEqual(0b11);

  generatorResult = generator.next();
  expect(generatorResult.done).toBeTruthy();
});