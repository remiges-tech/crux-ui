import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RTree, Rule, RulesetsList, SchemaDetails } from 'src/models/common-interfaces';
import { RuleSetDetailResp, RuleSetListResp } from 'src/models/request-response-inteface';
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
	constants = CONSTANTS;
	@ViewChild('workflowsTab') defaultTab: ElementRef | undefined;
	@ViewChildren('dynamicTab') Tabs: QueryList<any> | undefined;
	@Input({ required: true }) schemaData?: SchemaDetails
	private _schemaService = inject(BREschemaService);
	private _commonService = inject(CommonService);
	private _toastr = inject(ToastrService);
	WorksFlows: RulesetsList[] = [];
	tabs: any[] = [];
	ruleData!: RTree[]

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
	openRuledetailTabAndMakeAPIcall(event: RulesetsList) {
		if (!event.app || !event.slice || !event.class || !event.name) {
			return;
		}

		try {
			let tabAlreadyExist = this.tabs.find(tab => tab.content.name === event.name);
			if (!tabAlreadyExist) {
				this.tabs.push({
					name: event.name,
					content: this.getRuledetail(event.app, event.slice, event.class, event.name)
				})

				setTimeout(() => {
					this.autoDirectTab(event)
				}, 100)
			}
			console.log('Tab', this.tabs)
		} catch (err: any) {
			this._commonService.log({
				fileName: this.fileName,
				functionName: 'openRuledetailTabAndMakeAPIcall',
				err: err
			})
		}
	}

	getRuledetail(app: string, slice: number, Sclass: string, Rname: string): RTree[] {
		try {
			let data = {
				params: new HttpParams().append('app', app).append('slice', slice).append('class', Sclass).append('name', Rname)
			}
			let FinalRuleStruct: RTree[] = [];
			this._schemaService.getBREWorkflowDetails(data).subscribe((res: RuleSetDetailResp) => {
				if (res.status == CONSTANTS.SUCCESS) {
					let rules: Rule[] = res.data.ruleset.rules

					rules.forEach((rule: Rule) => {
						let ruleObj: RTree = {
							rulePattern: rule.rulepattern,
							ruleActions: rule.ruleactions
						}

						if (rule.ruleactions.thencall != null) {
							ruleObj.thenRuleset = this.getRuledetail(app, slice, Sclass, rule.ruleactions.thencall)
						}

						if (rule.ruleactions.elsecall != null) {
							ruleObj.elseRuleset = this.getRuledetail(app, slice, Sclass, rule.ruleactions.elsecall)
						}

						FinalRuleStruct.push(ruleObj);
					})
				} else {
					this._toastr.error(res?.message, CONSTANTS.ERROR);
				}
			}, (err: any) => {
				this._toastr.error(err, CONSTANTS.ERROR)
			})
			return FinalRuleStruct;
		} catch (error) {
			this._commonService.log({
				fileName: this.fileName,
				functionName: 'getRuledetail',
				err: error
			})
		}
		return []
	}

	// Function to get the list of all rulesets
	getRulesetsList() {
		try {
			this._schemaService.getBREWorkflowList().subscribe((res: RuleSetListResp) => {
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
			if (tab.name == event.name) {
				this.Tabs?.forEach((tab: any) => {
					if (tab.nativeElement.id == `${event.name}-tab`) {
						tab.nativeElement.click()
					}
				})
			}
		})
	}
}
