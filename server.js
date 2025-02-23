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
    getMinValueNode(node) {
        if (!node) return null; 
        while (node.left) {
            node = node.left;
        }
        return node;  
    }
    

    //deleting a node 
    delete(root, key) {
        if (!root) return null;
    
        // Standard BST delete
        if (key < root.key) {
            root.left = this.delete(root.left, key);
        } else if (key > root.key) {
            root.right = this.delete(root.right, key);
        } else {
            // Node with only one child or no child
            if (!root.left || !root.right) {
                root = root.left ? root.left : root.right;
            } else {
                // Node with two children: Get inorder successor
                let temp = this.getMinValueNode(root.right);
                root.key = temp.key;
                root.right = this.delete(root.right, temp.key);
            }
        }
    
        if (!root) return root; // If tree becomes empty
    
        // Update height
        this.updateHeight(root);
    
        // Get balance factor
        let balance = this.balanceFactor(root);
    
        // Balance the tree
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
    get(root, key) {
        if (!root) return false; 
    
        if (key === root.key) return true; 
        if (key < root.key) return this.get(root.left, key); 
        return this.get(root.right, key);
    }
    getKey(key) {
        return this.get(this.root, key);
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
// Insert numbers 0 to 500
for (let i = 0; i <= 500; i++) {
    avl.insertKey(i);
}
avl.printTree();
console.log('Before Deletion');
for (let i = 100; i <= 400; i++) {
        avl.deleteKey(i);
        }
avl.printTree();
console.log('After Deletion');
console.log(avl.getKey(300)); 
console.log(avl.getKey(500));
