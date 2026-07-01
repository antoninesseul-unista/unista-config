ACTION A80_AnaOutputs: 

	pConfiguratorDate.AO							:= '01/07/2026 17:16:27';
	// --------------------------------------------------------------------------------------------------------------- //
	//  AO 1 : AO1
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pAnaOutputList[1].Active								:= TRUE;
	pAnaOutputList[1].Enable								:= TRUE;
	pAnaOutputList[1].ID									:= 1;
	pAnaOutputList[1].ID_EM								:= 1;

	// Configuration
	pAnaOutputList[1].Cfg.Task							:= 4;
	// Linear calibration
	pAnaOutputList[1].Cfg.Linear.X1						:= 0;
	pAnaOutputList[1].Cfg.Linear.Y1						:= 0;
	pAnaOutputList[1].Cfg.Linear.X2						:= 100;
	pAnaOutputList[1].Cfg.Linear.Y2						:= 32567;
	// --------------------------------------------------------------------------------------------------------------- //
	//  AO 2 : AO2
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pAnaOutputList[2].Active								:= TRUE;
	pAnaOutputList[2].Enable								:= TRUE;
	pAnaOutputList[2].ID									:= 2;
	pAnaOutputList[2].ID_EM								:= 2;

	// Configuration
	pAnaOutputList[2].Cfg.Task							:= 4;
	// Linear calibration
	pAnaOutputList[2].Cfg.Linear.X1						:= 0;
	pAnaOutputList[2].Cfg.Linear.Y1						:= 0;
	pAnaOutputList[2].Cfg.Linear.X2						:= 100;
	pAnaOutputList[2].Cfg.Linear.Y2						:= 32567;

END_ACTION