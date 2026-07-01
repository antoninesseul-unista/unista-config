ACTION A40_Electrovalves: 

	pConfiguratorDate.EV := '01/07/2026 17:16:27';
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
	pElectrovalveList[1].Cfg.ElectrovalveType           := <no value>;
	pElectrovalveList[1].Cfg.Sensor                     := <no value>;
	pElectrovalveList[1].Cfg.CenterType                 := <no value>;
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
	pElectrovalveList[2].Cfg.ElectrovalveType           := <no value>;
	pElectrovalveList[2].Cfg.Sensor                     := <no value>;
	pElectrovalveList[2].Cfg.CenterType                 := <no value>;
	
END_ACTION