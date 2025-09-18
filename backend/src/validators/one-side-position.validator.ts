import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'oneSidePosition', async: false })
export class OneSidePositionConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    
    // At least one side must have assets
    const hasLongAssets = Array.isArray(value) && value.length > 0;
    const hasShortAssets = Array.isArray(relatedValue) && relatedValue.length > 0;
    
    // Allow validation to pass if this field is empty/undefined but the related field has assets
    if (!Array.isArray(value) || value.length === 0) {
      return hasShortAssets;
    }
    
    return hasLongAssets || hasShortAssets;
  }

  defaultMessage(args: ValidationArguments) {
    return 'At least one of longAssets or shortAssets must contain assets for a valid position';
  }
}

export function OneSidePosition(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: OneSidePositionConstraint,
    });
  };
}