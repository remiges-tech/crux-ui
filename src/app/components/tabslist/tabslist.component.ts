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
	@Input({required: true}) WorksFlows?: RulesetsList[] = [];
	private _schemaService = inject(BREschemaService);
	private _commonService = inject(CommonService);
	private _toastr = inject(ToastrService);
	tabs: any[] = [];

	ngOnInit() {
		
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
	async openRuledetailTabAndMakeAPIcall(event: RulesetsList) {
		if (!event.app || !event.slice || !event.class || !event.name) {
			return;
		}
		try {
			this._commonService.showLoader();
			let tabAlreadyExist = this.tabs.find(tab => tab.name === event.name);
			if (!tabAlreadyExist) {
				const data = await this.getRuledetail(event.app, event.slice, event.class, event.name);
				if (data instanceof Error) {
					throw data; 
				}
				else if (data.length > 0) {
					this.tabs.push({
						name: event.name,
						content: data
					});
				}
				this._commonService.hideLoader()
			}
			setTimeout(() => {
				this.autoDirectTab(event);
			}, 100);
		} catch (err: any) {
			this._commonService.hideLoader()
			this._commonService.log({
				fileName: this.fileName,
				functionName: 'openRuledetailTabAndMakeAPIcall',
				err: err
			});
		}
	}

	// Function to recurrsively fetch the details of a rule based on the provided parameters and create a data structure.
	async getRuledetail(app: string, slice: number, Sclass: string, Rname: string): Promise<RTree[] | Error> {
		try {
			this._commonService.showLoader();
			let data = {
				params: new HttpParams().append('app', app).append('slice', slice).append('class', Sclass).append('name', Rname)
			};

			const res: RuleSetDetailResp = await this._schemaService.getBREWorkflowDetails(data).toPromise();

			if (res.status === CONSTANTS.SUCCESS) {
				let rules: Rule[] = res.data.ruleset.rules;
				let FinalRuleStruct: RTree[] = [];

				for (const rule of rules) {
					let ruleObj: RTree = {
						rulePattern: rule.rulepattern,
						ruleActions: rule.ruleactions
					};

					if (rule.ruleactions.thencall != null) {
						// recursive call when the response data contains thencall
						const thenRuleset = await this.getRuledetail(app, slice, Sclass, rule.ruleactions.thencall);
						if (thenRuleset instanceof Error) {
							throw thenRuleset;
						}
						ruleObj.thenRuleset = thenRuleset;
					}
					if (rule.ruleactions.elsecall != null) {
						// recursive call when the response data contains elsecall
						const elseRuleset = await this.getRuledetail(app, slice, Sclass, rule.ruleactions.elsecall);
						if (elseRuleset instanceof Error) {
							throw elseRuleset;
						}
						ruleObj.elseRuleset = elseRuleset;
					}

					FinalRuleStruct.push(ruleObj);
				}
				this._commonService.hideLoader();
				return FinalRuleStruct;
			} else {
				this._commonService.hideLoader();
				this._toastr.error(res?.message, CONSTANTS.ERROR);
				return new Error(res?.message);
			}
		} catch (error: any) {
			this._toastr.error(error.message || error, CONSTANTS.ERROR)
			this._commonService.log({
				fileName: this.fileName,
				functionName: 'getRuledetail',
				err: error
			});
			return error;
		}
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
