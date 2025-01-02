import {Component} from "@odoo/owl";
import {ControlButtons} from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import {CreateOrderPopup} from "./CreateOrderPopup.esm.js";
import {Dialog} from "@web/core/dialog/dialog";
import {patch} from "@web/core/utils/patch";
import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";

export class CreateOrderButton extends Component {
    static props = {};
    static components = {Dialog};
    setup() {
        this.dialog = useService("dialog");
    }
    getOrder() {
        return this.dialog.add(CreateOrderPopup);
    }
}

CreateOrderButton.template = "pos_order_to_sale_order.CreateOrderButton";

// Register the component
registry.category("components").add("CreateOrderButton", CreateOrderButton);

patch(ControlButtons, {
    setup() {
        super.setup(...arguments);
    },
    components: {
        ...ControlButtons.components,
        CreateOrderButton,
    },
});
