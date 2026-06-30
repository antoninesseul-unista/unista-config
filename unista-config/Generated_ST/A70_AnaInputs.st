ACTION A70_AnaInputs: 

	pConfiguratorDate.AI							:= '30/06/2026 15:24:12';
	// --------------------------------------------------------------------------------------------------------------- //
	//  AI 1 : AI1
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pAnaInputList[1].Active							:= TRUE;
	pAnaInputList[1].Enable							:= TRUE;
	pAnaInputList[1].ID								:= 1;
	pAnaInputList[1].ID_EM							:= ju06zdi7u;

	// Configuration
	pAnaInputList[1].Cfg.Task							:= 4;
	pAnaInputList[1].Cfg.ForceAllowed					:= FALSE;

	// Linear calibration
	pAnaInputList[1].Cfg.Linear.X1					:= 0;
	pAnaInputList[1].Cfg.Linear.Y1					:= 0;
	pAnaInputList[1].Cfg.Linear.X2					:= 32567;
	pAnaInputList[1].Cfg.Linear.Y2					:= 100;
	// --------------------------------------------------------------------------------------------------------------- //
	//  AI 2 : AI2
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pAnaInputList[2].Active							:= TRUE;
	pAnaInputList[2].Enable							:= TRUE;
	pAnaInputList[2].ID								:= 2;
	pAnaInputList[2].ID_EM							:= ju06zdi7u;

	// Configuration
	pAnaInputList[2].Cfg.Task							:= 4;
	pAnaInputList[2].Cfg.ForceAllowed					:= FALSE;

	// Linear calibration
	pAnaInputList[2].Cfg.Linear.X1					:= 0;
	pAnaInputList[2].Cfg.Linear.Y1					:= 0;
	pAnaInputList[2].Cfg.Linear.X2					:= 32567;
	pAnaInputList[2].Cfg.Linear.Y2					:= 100;
	// --------------------------------------------------------------------------------------------------------------- //
	//  AI 3 : AI3
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pAnaInputList[3].Active							:= TRUE;
	pAnaInputList[3].Enable							:= TRUE;
	pAnaInputList[3].ID								:= 3;
	pAnaInputList[3].ID_EM							:= 0;

	// Configuration
	pAnaInputList[3].Cfg.Task							:= 4;
	pAnaInputList[3].Cfg.ForceAllowed					:= FALSE;

	// Linear calibration
	pAnaInputList[3].Cfg.Linear.X1					:= 0;
	pAnaInputList[3].Cfg.Linear.Y1					:= 0;
	pAnaInputList[3].Cfg.Linear.X2					:= 32567;
	pAnaInputList[3].Cfg.Linear.Y2					:= 100;

END_ACTION