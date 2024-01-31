import { HttpParams } from '@angular/common/http';
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
	@ViewChildren('dynamicTab') Tabs: QueryList<any> | undefined;
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
		if (!event.app || !event.slice || !event.class || !event.name) {
			return;
		}
		try {
			let data = {
				params: new HttpParams().append('app', event.app).append('slice', event.slice).append('class', event.class).append('name', event.name)
			}
			this._schemaService.getBREWorkflowDetails(data).subscribe((res: any) => {
				if (res.status == CONSTANTS.SUCCESS) {
					this.autoDirectTab(event)
					let tabAlreadyExist = this.tabs.find(tab => tab.tab.name === event.name);
					if (!tabAlreadyExist) {
						this.tabs.push({
							tab: {
								id: event.id,
								name: event.name,
							},
							content: res.data
						})
						setTimeout(() => {
							this.autoDirectTab(event)
						}, 100)
					}
				} else {
					this._toastr.error(res?.message, CONSTANTS.ERROR);
				}
			}, (err: any) => {
				this._toastr.error(err, CONSTANTS.ERROR)
			})
		} catch (error) {
			this._commonService.log({
				fileName: this.fileName,
				functionName: 'getRuledetailAndOpeninNewTab',
				err: error
			})
		}
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

	getSchemaDetails() {
		this.schemaData = undefined
	}

	getConstraints(patternschema: any): string {
		let constraints = '';
		if ('valmin' in patternschema) {
			constraints += `Min  ${patternschema.valmin}`;
		}
		if ('valmax' in patternschema) {
			constraints += `${constraints ? ' - ' : ''}Max  ${patternschema.valmax}`;
		}
		if ('lenmin' in patternschema) {
			constraints += `${constraints ? ' - ' : ''}Min  ${patternschema.lenmin}`;
		}
		if ('lenmax' in patternschema) {
			constraints += `${constraints ? ' - ' : ''}Max  ${patternschema.lenmax}`;
		}
		return constraints || (patternschema.vals ? '' : 'No constraints');
	}

	autoDirectTab(event: any) {
		this.tabs.forEach((tab: any) => {
			if (tab.tab.name == event.name) {
				this.Tabs?.forEach((tab: any) => {
					if (tab.nativeElement.id == `${event.name}-tab`) {
						tab.nativeElement.click()
					}
				})
				return;
			}
		})
	}
}
