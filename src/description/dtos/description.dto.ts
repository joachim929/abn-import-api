import { Description } from '../description.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type DescriptionLogic = 'contains' | 'notContains';
export type AndOr = 'and' | 'or';

export class DescriptionDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ruleId: number;

  @ApiProperty()
  descriptionSubString: string;

  @ApiProperty()
  logic: DescriptionLogic;

  @ApiPropertyOptional()
  andOr?: AndOr;

  constructor(description: Description) {
    this.id = description.id;
    this.ruleId = description.ruleId;
    this.descriptionSubString = description.descriptionSubString;
    this.logic = description.logic;
    if (description.andOr) {
      this.andOr = description.andOr;
    }
  }
}
