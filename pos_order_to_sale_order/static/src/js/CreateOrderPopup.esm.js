import {Component} from "@odoo/owl";
import {Dialog} from "@web/core/dialog/dialog";
import {usePos} from "@point_of_sale/app/store/pos_hook";
import {useService} from "@web/core/utils/hooks";

export class CreateOrderPopup extends Component {
    static props = {
        close: Function,
    };
    static template = "pos_order_to_sale_order.CreateOrderPopup";
    static components = {Dialog};
    setup() {
        super.setup();
        this.pos = usePos();
        this.ui = useService("ui");
        this.orm = useService("orm");
    }

    async createDraftSaleOrder() {
        await this._actionCreateSaleOrder("draft");
    }

    async createConfirmedSaleOrder() {
        await this._actionCreateSaleOrder("confirmed");
    }

    async createDeliveredSaleOrder() {
        await this._actionCreateSaleOrder("delivered");
    }

    async createInvoicedSaleOrder() {
        await this._actionCreateSaleOrder("invoiced");
    }

    async _actionCreateSaleOrder(order_state) {
        await this._createSaleOrder(order_state);

        // Delete the current order
        const current_order = this.pos.get_order();
        this.pos.removeOrder(current_order);
        this.pos.add_new_order();
        this.props.close();
    }

    async _createSaleOrder(order_state) {
        const current_order = this.pos.get_order();
        const current_order_lines = Array.from(current_order.get_orderlines());
        this.ui.block();

        return await this.orm
            .call("sale.order", "create_order_from_pos", [
                current_order._raw,
                current_order_lines.map((line) => line._raw),
                order_state,
            ])
            .catch((error) => {
                console.error("Failed to create sale order:", error);
                throw error;
            })
            .finally(() => {
                this.ui.unblock();
            });
    }
}
