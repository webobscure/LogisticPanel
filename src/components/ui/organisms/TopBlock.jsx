import { MonthlyIncome } from "../molecules/MonthlyIncome"
import { TotalEfficiency } from "../molecules/TotalEfficiency"
import { TotalWorkload } from "../molecules/TotalWorkload"
import styled from 'styled-components';

const TopBlockContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;

  /* Стили для дочерних компонентов */
  & > * {
    flex: 1; /* Равномерное распределение ширины */
    width: 100%;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const TopBlock = () => {
  return (
    <TopBlockContainer>
      <TotalWorkload />
      <MonthlyIncome />
      <TotalEfficiency />
    </TopBlockContainer>
  )
}