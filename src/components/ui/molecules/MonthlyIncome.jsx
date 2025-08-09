import { Card } from "../atoms/Card";
import { CardHeader } from "../atoms/cardHeader";
import { CardValue } from "../atoms/cardValue";
import { CardDescription } from "../atoms/cardDescription";

export const MonthlyIncome = ({ 
  title = 'Месячный доход',
  value = '1.2M',
  text = '₽',
  description = '+12% к прошлому месяцу'
}) => {
  return (
    <Card>
      <CardHeader 
        title={title} 
        iconType="income" 
        color="#f1a41eff" 
      />

      <CardValue value={value} text={text} />

      <CardDescription>{description}</CardDescription>
    </Card>
  );
};