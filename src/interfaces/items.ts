export enum ItemEffectStat {
  ATK = 'ATK',
  DEF = 'DEF',
  INT = 'INT',
  HP = 'HP',
  SP = 'SP',
  SPD = 'SPD',
  EXP = 'EXP',
  MEM = 'MEM',
  EVA = 'EVA',
  ACU = 'ACU',
  CRT = 'CRT',
  CAM = 'CAM',
  Revival = 'revival',
  HPSP = 'HP & SP'
}

export enum ItemEffectDuration {
  FiveTurns = '5-turns',
  OnUse = 'on-use',
  Permanent = 'permanent',
  PermanentEquip = 'permanent-equiped'
}

export enum ItemEffectTarget {
  Digifarm = 'digifarm',
  Digivice = 'digivice',
  Single = 'single',
  Team = 'team',
}

export enum ItemEffectUnit {
  None = 'none',
  Percentage = 'percentage',
}
