import { Card } from "../atoms/Card";
import { CardHeader } from "../atoms/cardHeader";
import { CardValue } from "../atoms/cardValue";
import { CardDescription } from "../atoms/cardDescription";

export const InfoItem = ({
    title = 'Заголовок',
    value = '0',
    text = '',
    description = 'Описание',
    iconType = 'default',
    iconColor = 'green',
}) => {
  return (
    <Card>
      <CardHeader title={title} iconType={iconType} iconColor={iconColor}/>
    	<CardValue value={value} text={text}/>
      <CardDescription description={description}/>
    </Card>
  )
}