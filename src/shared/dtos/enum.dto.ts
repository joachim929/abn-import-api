import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ConditionOperatorEnum } from '../../rules/interfaces/condition-operator.enum';
import { LogicTypeEnum } from '../../rules/interfaces/logic-type.enum';
import { TransferKeyEnum } from '../../rules/interfaces/transfer-key.enum';

export type UserRole = 'Admin' | 'Moderator' | 'User';

export class Cat {
  type: string;
}

export class Dog {
  type: number;
}


type Pet = Cat | Dog;


export class EnumDTO {

  @ApiProperty({enum: ConditionOperatorEnum, enumName: 'ConditionOperatorEnum'})
  conditionOperatorEnum: ConditionOperatorEnum

  @ApiProperty({enum: LogicTypeEnum, enumName: 'LogicTypeEnum'})
  logicTypeEnum: LogicTypeEnum

  @ApiProperty({enum: TransferKeyEnum, enumName: 'TransferKeyEnum'})
  transferKeyEnum: TransferKeyEnum

  @ApiProperty({ enum: ['Admin', 'Moderator', 'User']})
  role: UserRole;

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

