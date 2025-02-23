class AVLNode{
    constructor(Key){
        this.key = Key;
        this.left=null;
        this.right=null;
        this.height=1;
    }
}

class AVLTree{
    constructor(){
        this.root = null;
    }
    height(node){
        return node ? node.height :0;
    }

    balanceFactor(node){
        return this.height(node.left) - this.height(node.right);
    }

    updateHeight(node){
        if(!node) return
        node.height = Math.max(this.height(node.left) , this.height(node.right)) + 1;
    }
      //Rotations
    rightRotate(y){
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        this.updateHeight(y);
        this.updateHeight(x);
        return x;
    }
    leftRotate(x){
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        this.updateHeight(x);
        this.updateHeight(y);
        return y;
    }

    balance(node,key){
        const balance = this.balanceFactor(node);

        // Left Heavy
        if (balance > 1) {
            return (key < node.left.key) 
                ? this.rightRotate(node)  // LL
                : (node.left = this.leftRotate(node.left), this.rightRotate(node));  // LR
        }
        // Right Heavy
        if (balance < -1) {
            return (key > node.right.key) 
                ? this.leftRotate(node)  // RR
                : (node.right = this.rightRotate(node.right), this.leftRotate(node));  // RL
        }
        return node; 
    }
    //inserting a node
    insert(root,key){
        if(!root) return new AVLNode(key);

        if(key <  root.key) root.left = this.insert(root.left,key);
        else if(key > root.key) root.right = this.insert(root.right,key);
        else return root;

        this.updateHeight(root);
        return this.balance(root,key);
    }
    //min value for deleting
    getMinValueNode(node){
        return node.left ? this.getMinValueNode(node.left) : 0;
    }

    //deleting a node 
    delete(root,key){
        if (!root) return null;
        if(key <  root.key) root.left = this.delete(root.left,key);
        else if(key > root.key) root.right = this.delete(root.right,key);
        else{
            if(!root.left) return root.right;
            if(!root.right) return root.left;

            const minNode = this.getMinValueNode(root.right);
            root.key = minNode.key;
            root.right = this.delete(root.right,minNode.key);
        }
        this.updateHeight(root);
        const balance = this.balanceFactor(root);
        //rotation after deletion using balanceFactor
        if (balance > 1) {
            return this.balanceFactor(root.left) >= 0
                ? this.rightRotate(root)
                : (root.left = this.leftRotate(root.left), this.rightRotate(root));
        }
        if (balance < -1) {
            return this.balanceFactor(root.right) <= 0
                ? this.leftRotate(root)
                : (root.right = this.rightRotate(root.right), this.leftRotate(root));
        }
        return root;
            
    }

    insertKey(key){
        this.root = this.insert(this.root,key);
    }

    deleteKey(key){
        this.root = this.delete(this.root,key);
    }

    updateKey(key,newKey){
        this.deleteKey(key);
        this.insertKey(newKey);
    }

    printTree(){
        this.inorder(this.root);
        console.log();
    }
    inorder(node){
        if(node){
            this.inorder(node.left);
            process.stdout.write(node.key + ' ');
            this.inorder(node.right);
        }
    }
}

// Test
const avl = new AVLTree();
const keys = [34, 45, 67, 65, 2, 3, 9, 0];
keys.forEach(key => avl.insertKey(key));
console.log('Initial');
avl.printTree();
//delete operation
avl.deleteKey(0);
console.log('Tree after deletion of 0');
avl.printTree();

//insertion operation
avl.insertKey(56);
console.log('Tree after insertion of 56')
avl.printTree();
 //update 56 with 100
avl.updateKey(34,89);
console.log('Tree after update of 56 with 100')
avl.printTree();