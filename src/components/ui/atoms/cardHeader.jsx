import { FiTrendingUp, FiDollarSign, FiActivity, FiAnchor, FiXOctagon, FiMap, FiTool, FiCalendar, FiCheck } from 'react-icons/fi';
import styled from 'styled-components';

// Стилизованные компоненты
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  color: ${props => props.color || '#4F46E5'};

  &:hover {
    transform: scale(1.1);
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

// Иконки из react-icons
const icons = {
  load: <FiTrendingUp size={20} />,
  income: <FiDollarSign size={20} />,
  efficiency: <FiActivity size={20} />,
  activeTrips: <FiMap size={20} />,
  based: <FiAnchor size={20} />,
  issues: <FiXOctagon size={20} />,
  repair: <FiTool size={20} />,
  planTO: <FiCalendar size={20} />,
  default: <FiCheck size={20} color='green'/>
};

export const CardHeader = ({ title = 'Заголовок', iconType, iconColor = '#4F46E5',}) => {
  const icon = icons[iconType] || icons.load;
  
  return (
    <HeaderContainer>
      <IconWrapper color={iconColor}>
        {icon}
      </IconWrapper>
      <Title>{title}</Title>
    </HeaderContainer>
  );
};