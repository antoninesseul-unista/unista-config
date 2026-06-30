ACTION A90_DirectMotors: 

	pConfiguratorDate.DM						:= '30/06/2026 15:24:12';
	// --------------------------------------------------------------------------------------------------------------- //
	//  DM 1 : DM1
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pDirectMotorList[1].Active						:= TRUE;
	pDirectMotorList[1].Enable						:= TRUE;
	pDirectMotorList[1].ID							:= 1;
	pDirectMotorList[1].ID_EM							:= ju06zdi7u;

	// Configuration
	pDirectMotorList[1].Cfg.Task						:= 4;
	pDirectMotorList[1].Cfg.MotorLevel				:= FALSE;
	pDirectMotorList[1].Cfg.MotorType					:= OnlyFwd;
	// --------------------------------------------------------------------------------------------------------------- //
	//  DM 2 : DM2
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pDirectMotorList[2].Active						:= TRUE;
	pDirectMotorList[2].Enable						:= TRUE;
	pDirectMotorList[2].ID							:= 2;
	pDirectMotorList[2].ID_EM							:= w88ozmced;

	// Configuration
	pDirectMotorList[2].Cfg.Task						:= 4;
	pDirectMotorList[2].Cfg.MotorLevel				:= FALSE;
	pDirectMotorList[2].Cfg.MotorType					:= TwoSens;

END_ACTION