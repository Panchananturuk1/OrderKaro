// Declaration file for modules without type definitions

declare module 'react' {
  namespace React {
    interface Component<P = {}, S = {}> {
      props: P;
      state: S;
      context: any;
      setState(state: Partial<S>, callback?: () => void): void;
      forceUpdate(callback?: () => void): void;
      render(): JSX.Element | null;
    }
    
    interface FC<P = {}> {
      (props: P): JSX.Element | null;
      displayName?: string;
    }
    
    type ComponentType<P = {}> = FC<P> | (new (props: P) => Component<P>);
    
    function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
    function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  }
  
  export = React;
}

declare module 'react-native' {
  import React from 'react';
  
  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const StyleSheet: {
    create<T extends Record<string, any>>(styles: T): T;
  };
  export const Image: React.ComponentType<any>;
  export const ScrollView: React.ComponentType<any>;
  export const TouchableOpacity: React.ComponentType<any>;
  export const SafeAreaView: React.ComponentType<any>;
  export const ActivityIndicator: React.ComponentType<any>;
  export const Share: {
    share(content: { message?: string; url?: string }, options?: any): Promise<any>;
  };
  export const Alert: {
    alert(title: string, message?: string, buttons?: any[], options?: any): void;
  };
}

declare module '@react-navigation/native' {
  export const NavigationContainer: React.ComponentType<any>;
  export const useNavigation: () => any;
  export const useRoute: () => any;
  export type RouteProp<T, K extends keyof T> = {
    key: string;
    name: K;
    params: T[K];
  };
}

declare module '@react-navigation/stack' {
  export const createStackNavigator: () => any;
  export type StackNavigationProp<T, K extends keyof T = keyof T> = {
    navigate<RouteName extends keyof T>(
      ...args: RouteName extends K
        ? [RouteName] | [RouteName, T[RouteName]]
        : [RouteName]
    ): void;
    goBack(): void;
  };
}

declare module '@react-navigation/bottom-tabs' {
  export const createBottomTabNavigator: () => any;
}

declare module 'react-native-safe-area-context' {
  export const SafeAreaProvider: React.ComponentType<any>;
}

declare module 'react-redux' {
  export const Provider: React.ComponentType<any>;
  export const useDispatch: () => any;
}

declare module 'expo-status-bar' {
  import React from 'react';
  export const StatusBar: React.ComponentType<{
    style?: 'auto' | 'inverted' | 'light' | 'dark';
  }>;
}

declare module 'react-native-vector-icons/Ionicons' {
  import React from 'react';
  
  class IconComponent extends React.Component<any> {
    static getImageSource: any;
  }
  
  const Ionicons: typeof IconComponent & React.ComponentType<any>;
  
  export default Ionicons;
}

// Asset types
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
} 