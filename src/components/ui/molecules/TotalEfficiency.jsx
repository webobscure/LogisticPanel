import { Card } from "../atoms/Card";
import { CardHeader } from "../atoms/cardHeader";
import { CardValue } from "../atoms/cardValue";
import { CardDescription } from "../atoms/cardDescription";

export const TotalEfficiency = ({ 
  title = 'Эффективность',
  value = '92%',
  text = '',
  description = 'Средняя по парку'
}) => {
  return (
    <Card>
      <CardHeader 
        title={title} 
        iconType="efficiency" 
        color="#e846d5ff" 
      />

      <CardValue value={value} text={text} />

      <CardDescription>{description}</CardDescription>
    </Card>
  );
};