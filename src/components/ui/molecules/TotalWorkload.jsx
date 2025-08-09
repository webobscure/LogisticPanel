import { Card } from "../atoms/Card";
import { CardHeader } from "../atoms/cardHeader";
import { CardValue } from "../atoms/cardValue";
import { CardLabel } from "../atoms/cardLabel";

export const TotalWorkload = ({ 
  title = 'Общая нагрузка', 
  text = 'ТС',
  statuses = [
    { amount: 24, status: 'inWork' },
    { amount: 3, status: 'idle' },
    { amount: 2, status: 'broken' }
  ],
  colors = {
    inWork: 'green',
    idle: 'yellow',
    broken: 'red'
  }
}) => {
  // Вычисляем общее количество машин
  const totalValue = statuses.reduce((sum, status) => sum + status.amount, 0);

  return (
    <Card>
      <CardHeader 
        title={title} 
        iconType="load" 
        color="#4F46E5" 
      />

      <CardValue value={totalValue} text={text} />

      <div style={{ display: 'flex', gap: '1rem', color:'black' }}>
        {statuses.map((statusInfo, index) => (
          <CardLabel 
            key={index}
            amount={statusInfo.amount}
            status={statusInfo.status}
            colors={colors}
          />
        ))}
      </div>
    </Card>
  );
};