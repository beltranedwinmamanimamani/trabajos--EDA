class BuddyNode {
    constructor(size) {
        this.size = size;
        this.free = true;
        this.left = null;
        this.right = null;
    }

    split() {
        this.left = new BuddyNode(this.size / 2);
        this.right = new BuddyNode(this.size / 2);
        this.free = false;
    }

    merge() {
        this.left = null;
        this.right = null;
        this.free = true;
    }
}

class BuddyTree {
    constructor(size) {
        this.root = new BuddyNode(size);
    }

    allocate(size) {
        return this._allocate(this.root, size);
    }

    _allocate(node, size) {
        if (node.size < size || !node.free) return false;

        if (node.size === size) {
            node.free = false;
            return true;
        }

        if (!node.left && !node.right) node.split();

        return this._allocate(node.left, size) || this._allocate(node.right, size);
    }

    free(size) {
        this._free(this.root, size);
    }

    _free(node, size) {
        if (!node || node.size < size || node.free) return false;

        if (node.size === size) {
            node.free = true;
            return true;
        }

        if (this._free(node.left, size) || this._free(node.right, size)) {
            if (node.left.free && node.right.free) node.merge();
            return true;
        }

        return false;
    }

    render(node = this.root, depth = 0, html = "") {
        if (!node) return html;

        html += `<div class="block ${node.free ? 'free' : 'used'}" 
                     style="margin-left: ${depth * 20}px" 
                     onclick="toggleBlock(${node.size}, ${node.free})">
                     Tamaño: ${node.size}</div>`;
        if (node.left || node.right) {
            html = this.render(node.left, depth + 1, html);
            html = this.render(node.right, depth + 1, html);
        }

        return html;
    }
}

const tree = new BuddyTree(32);
document.getElementById('tree').innerHTML = tree.render();

function allocate(size) {
    tree.allocate(size);
    document.getElementById('tree').innerHTML = tree.render();
}

function free(size) {
    tree.free(size);
    document.getElementById('tree').innerHTML = tree.render();
}

function toggleBlock(size, isFree) {
    if (isFree) {
        tree.allocate(size);
    } else {
        tree.free(size);
    }
    document.getElementById('tree').innerHTML = tree.render();
}
