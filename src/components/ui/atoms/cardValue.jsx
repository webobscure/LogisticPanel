import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Value = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
`;

const Text = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: black;
  line-height: 1.5;
  display: inline-block;
`;

export const CardValue = ({ value = '29', text = 'ТС' }) => {
  return (
    <Container>
      <Value>{value}</Value>
      <Text>{text}</Text>
    </Container>
  );ч
};