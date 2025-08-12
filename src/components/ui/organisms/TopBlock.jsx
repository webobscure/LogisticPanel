import styled from 'styled-components';

const TopBlockContainer = styled.div`
  display: flex;
  width: 100%;

  /* Стили для дочерних компонентов */
  & > * {
    flex: 1; /* Равномерное распределение ширины */
    width: 100%;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const TopBlock = ({ children }) => {
  return <TopBlockContainer>{children}</TopBlockContainer>;
};