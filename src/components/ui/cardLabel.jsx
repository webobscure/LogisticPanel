import styled from 'styled-components';

const LabelContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
`;

const StatusDot = styled.div`
  display: inline-block;
  background-color: ${props => props.$color};
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
`;

const StatusAmount = styled.span`
  font-weight: 500;
`;

const StatusText = styled.span`
  color: #666;
`;

export const CardLabel = ({ amount = 12, status = 'idle', colors = {} }) => {
  const statusMap = {
    inWork: { text: 'В работе', defaultColor: 'green' },
    idle: { text: 'Простой', defaultColor: 'yellow' },
    broken: { text: 'Поломка', defaultColor: 'red' }
  };

  const { text, defaultColor } = statusMap[status] || { text: status, defaultColor: 'grey' };
  const color = colors[status] || defaultColor;

  return (
    <LabelContainer>
      <StatusDot $color={color} />
      <StatusAmount>{amount}</StatusAmount>
      <StatusText>{text}</StatusText>
    </LabelContainer>
  );
};