import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';


jest.mock('react-native-mmkv', () => {
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      getString: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      getBoolean: jest.fn(),
    })),
  };
});
