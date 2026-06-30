ACTION A40_Electrovalves: 

	pConfiguratorDate.EV := '30/06/2026 15:25:21';


	// --------------------------------------------------------------------------------------------------------------- //
	//  EV 1 : EV1
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pElectrovalveList[1].Active                         := TRUE;
	pElectrovalveList[1].Enable                         := TRUE;
	pElectrovalveList[1].ID                             := 1;
	pElectrovalveList[1].ID_EM                          := 1;
	
	// Configuration
	pElectrovalveList[1].Cfg.Task                       := 4;
	pElectrovalveList[1].Cfg.ElectrovalveType           := Monostable;
	pElectrovalveList[1].Cfg.Sensor                     := NoSensor;
	pElectrovalveList[1].Cfg.CenterType                 := Open;

	// --------------------------------------------------------------------------------------------------------------- //
	//  EV 2 : EV2
	// --------------------------------------------------------------------------------------------------------------- //
	// Activation
	pElectrovalveList[2].Active                         := TRUE;
	pElectrovalveList[2].Enable                         := TRUE;
	pElectrovalveList[2].ID                             := 2;
	pElectrovalveList[2].ID_EM                          := 1;
	
	// Configuration
	pElectrovalveList[2].Cfg.Task                       := 4;
	pElectrovalveList[2].Cfg.ElectrovalveType           := Bistable;
	pElectrovalveList[2].Cfg.Sensor                     := BwdSensor;
	pElectrovalveList[2].Cfg.CenterType                 := Open;

	
END_ACTION