import styled from 'styled-components';

const Description = styled.div`
  color: #666;
`;

export const CardDescription = ({ children, description }) => {
  // Используем description или children (более гибкий вариант)
  const content = description || children;
  
  return <Description>{content}</Description>;
};