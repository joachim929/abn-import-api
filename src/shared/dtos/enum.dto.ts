import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ConditionOperatorEnum } from '../../rules/interfaces/condition-operator.enum';
import { LogicTypeEnum } from '../../rules/interfaces/logic-type.enum';
import { TransferKeyEnum } from '../../rules/interfaces/transfer-key.enum';
import { DateOperatorsEnum } from '../../rules/interfaces/date-operators.enum';
import { StringOperatorsEnum } from '../../rules/interfaces/string-operators.enum';
import { NumberOperatorsEnum } from '../../rules/interfaces/number-operators.enum';

export class Cat {
  type: string;
}

export class Dog {
  type: number;
}


type Pet = Cat | Dog;


export class EnumDTO {

  @ApiProperty({enum: ConditionOperatorEnum, enumName: 'ConditionOperatorEnum'})
  conditionOperatorEnum: ConditionOperatorEnum;

  @ApiProperty({ enum: DateOperatorsEnum, enumName: 'DateOperatorsEnum', type: () => DateOperatorsEnum})
  dateOperatorsEnum: DateOperatorsEnum;
  @ApiProperty({enum: StringOperatorsEnum, enumName: 'StringOperatorsEnum', type: () => StringOperatorsEnum})
  stringOperatorsEnum: StringOperatorsEnum;
  @ApiProperty({ enum: NumberOperatorsEnum, enumName: 'NumberOperatorsEnum', type: () => NumberOperatorsEnum})
  numberOperatorsEnum: NumberOperatorsEnum;

  @ApiProperty({enum: LogicTypeEnum, enumName: 'LogicTypeEnum'})
  logicTypeEnum: LogicTypeEnum

  @ApiProperty({enum: TransferKeyEnum, enumName: 'TransferKeyEnum'})
  transferKeyEnum: TransferKeyEnum;

  @ApiProperty()
  cat: Cat;

  @ApiProperty()
  dog: Dog;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(Cat) },
      { $ref: getSchemaPath(Dog) },
    ],
  })
  pet: Cat | Dog;

  @ApiProperty({
      oneOf: [
        { $ref: getSchemaPath(Cat) },
        { $ref: getSchemaPath(Dog) },
      ]
  })
  pets: Pet;

}

