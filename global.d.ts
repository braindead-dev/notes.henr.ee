declare namespace NodeJS {
    interface Global {
      pastes?: Map<string, { title: string; content: string }>;
    }
  }
  
  declare let global: NodeJS.Global;
  