class MyMCTS extends MCTS {
    select(model) {
        let node = this.tree.get(0);
        let actions = [new AlgAction("selection", node.id, null, null)];

        while (!node.isLeaf() && this.isFullyExplored(node, model)) {
            node = this.getBestChildUCB1(node);
            model.makeMove(node.data.move);

            actions.push(new AlgAction("selection", node.id, null, null));
        }

        return {node: node, model: model, actions: actions};
    }

    expand(node, model) {
        let expandedNode = null;
        let actions = [];

        if (model.checkWin() === "") {
            let legalPositions = this.getAvailablePlays(node, model);
            let randomPos = legalPositions[myp5.round(myp5.random(legalPositions.length - 1))];

            let otherPlayer = getOtherPlayer(node.data.move.player);

            let randomMove = new GameMove(otherPlayer, randomPos);
            model.makeMove(randomMove);

            expandedNode = new Node(new GameNode(randomMove));
            this.tree.insert(expandedNode, node);

            actions = [new AlgAction("expansion", expandedNode.id, null, null)];
        } else {
            expandedNode = node;
        }

        return {
            node: expandedNode,
            model: model,
            actions: actions};
    }

    simulate(node, model) {
        let currentPlayer = node.data.move.player;

        while (model.checkWin() === "") {
            currentPlayer = getOtherPlayer(currentPlayer);
            model.makeRandomMove(currentPlayer);
        }

        let winner_icon = model.checkWin();

        return {
            winner_icon: winner_icon,
            actions: [new AlgAction("simulation", node.id, null, {
                "result": winner_icon,
                "board": model.copy()
            })]
        };
    }

    backpropagate(node, winner) {
        let actions = [];
        let action = new AlgAction("backpropagation", node.id, {
            old_value: node.data.value,
            old_visits: node.data.simulations
        }, null);

        node.data.simulations += 1;
        if (!node.isRoot()) {
            if ((node.data.move.player === PLAYER.MACHINE && winner === "m") ||
                (node.data.move.player === PLAYER.HUMAN   && winner === "h")) {
                node.data.value += 1;
            }
            if ((node.data.move.player === PLAYER.MACHINE && winner === "h") ||
                (node.data.move.player === PLAYER.HUMAN   && winner === "m")) {
                node.data.value -= 1;
            }

            actions = actions.concat(this.backpropagate(this.tree.getParent(node), winner).actions);
        }

        action.new_data = {
            new_value: node.data.value,
            new_visits: node.data.simulations
        };

        actions.unshift(action);

        return {actions: actions};
    }

}