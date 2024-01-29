import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RulesetsList, SchemaDetails } from 'src/models/common-interfaces';
import { BREschemaService } from 'src/services/breschema.service';
import { CommonService } from 'src/services/common.service';
import { CONSTANTS } from 'src/services/constants.service';

@Component({
	selector: 'app-tabslist',
	templateUrl: './tabslist.component.html',
	styleUrls: ['./tabslist.component.scss']
})
export class TabslistComponent {
	fileName = 'TabslistComponent';
	@ViewChild('workflowsTab') defaultTab: ElementRef | undefined;
	@ViewChildren('dynamicTab') Tabs:  QueryList<any> | undefined;
	@Input({ required: true }) schemaData?: SchemaDetails
	private _schemaService = inject(BREschemaService);
	private _commonService = inject(CommonService);
	private _toastr = inject(ToastrService);
	WorksFlows: RulesetsList[] = [];
	tabs: any[] = [];

	constructor() { }

	ngOnInit() {
		this.getRulesetsList();
	}

	// Function to close dynamic Tab
	close(event: MouseEvent, toRemove: number) {
		this.tabs = this.tabs.filter((id) => id !== toRemove);
		this.defaultTab?.nativeElement.click();
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	// Function to get ruleset details for particular selected ruleset
	// And open it in new tab
	getRuledetailAndOpeninNewTab(event: RulesetsList) {
		if(this.tabs.includes(event.name)){
			this.Tabs?.forEach((tab:any) => {
				if(tab.nativeElement.id == `${event.name}-tab`){
					tab.nativeElement.click()
				}
			})
			return;
		}
		this.tabs.push(event.name)
	}

	// Function to get the list of all rulesets
	getRulesetsList() {
		try {
			this._schemaService.getBREWorkflowList().subscribe((res: any) => {
				if (res?.status == CONSTANTS.SUCCESS) {
					this.WorksFlows = res?.data?.rulesets;
				} else {
					this._toastr.error(res?.message, CONSTANTS.ERROR);
				}
			}, (err: any) => {
				this._toastr.error(err, CONSTANTS.ERROR)
			})
		} catch (error) {
			this._commonService.log({
				fileName: this.fileName,
				functionName: 'getRulesetsList',
				err: error
			})
		}
	}
}
