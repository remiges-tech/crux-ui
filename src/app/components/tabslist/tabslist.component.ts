import { Component, Input } from '@angular/core';
import { SchemaDetails } from 'src/models/common-interfaces';

@Component({
  selector: 'app-tabslist',
  templateUrl: './tabslist.component.html',
  styleUrls: ['./tabslist.component.scss']
})
export class TabslistComponent {
	@Input({required:true}) schemaData?:SchemaDetails
  navs = [1, 2, 3, 4, 5];

	close(event: MouseEvent, toRemove: number) {
		this.navs = this.navs.filter((id) => id !== toRemove);
		event.preventDefault();
		event.stopImmediatePropagation();
	}
}
