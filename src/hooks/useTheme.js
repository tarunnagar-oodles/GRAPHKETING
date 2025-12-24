// Custom hook for theme colors based on dark mode
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../store/slices/settingsSlice';
import { COLORS } from '../utils/constants';

const useTheme = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  return {
    isDarkMode,
    colors,
  };
};

export default useTheme;
