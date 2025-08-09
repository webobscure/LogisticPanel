import styled from 'styled-components';

const LabelContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const StatusDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${props => props.$color};
`;

const StatusAmount = styled.span`
  font-weight: 500;
`;

const StatusText = styled.span`
  color: #666;
`;

const STATUS_CONFIG = {
  inWork: { text: 'В работе' },
  idle: { text: 'Простой' },
  broken: { text: 'Поломка' }
};

export const CardLabel = ({ amount = 0, status = 'idle', colors = {} }) => {
  const config = STATUS_CONFIG[status] || { text: status };
  const color = colors[status] || 
    (status === 'inWork' ? 'green' : 
     status === 'broken' ? 'red' : 'yellow');

  return (
    <LabelContainer>
      <StatusDot $color={color} />
      <StatusAmount>{amount}</StatusAmount>
      <StatusText>{config.text}</StatusText>
    </LabelContainer>
  );
};