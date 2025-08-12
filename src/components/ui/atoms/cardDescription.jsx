import styled from 'styled-components';

const Description = styled.div`
  color: #666;
`;

export const CardDescription = ({ children, description }) => {
  const content = description || children;
  
  return <Description>{content}</Description>;
};