ACTION A80_AnaOutputs: 

	pConfiguratorDate.AO							:= '30/06/2026 15:24:12';
	// --------------------------------------------------------------------------------------------------------------- //
	//  AO 1 : AO1
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pAnaOutputList[1].Active							:= TRUE;
	pAnaOutputList[1].Enable							:= TRUE;
	pAnaOutputList[1].ID								:= 1;
	pAnaOutputList[1].ID_EM								:= ju06zdi7u;

	// Configuration
	pAnaOutputList[1].Cfg.Task							:= 4;
	pAnaOutputList[1].Cfg.ForceAllowed					:= FALSE;

	// Linear calibration
	pAnaOutputList[1].Cfg.Linear.X1						:= 0;
	pAnaOutputList[1].Cfg.Linear.Y1						:= 0;
	pAnaOutputList[1].Cfg.Linear.X2						:= 100;
	pAnaOutputList[1].Cfg.Linear.Y2						:= 32567;
	// --------------------------------------------------------------------------------------------------------------- //
	//  AO 2 : AO2
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pAnaOutputList[2].Active							:= TRUE;
	pAnaOutputList[2].Enable							:= TRUE;
	pAnaOutputList[2].ID								:= 2;
	pAnaOutputList[2].ID_EM								:= w88ozmced;

	// Configuration
	pAnaOutputList[2].Cfg.Task							:= 4;
	pAnaOutputList[2].Cfg.ForceAllowed					:= FALSE;

	// Linear calibration
	pAnaOutputList[2].Cfg.Linear.X1						:= 0;
	pAnaOutputList[2].Cfg.Linear.Y1						:= 0;
	pAnaOutputList[2].Cfg.Linear.X2						:= 100;
	pAnaOutputList[2].Cfg.Linear.Y2						:= 32567;

END_ACTION