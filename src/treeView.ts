import toTreeView from "./utils/toTreeView";
import htmlTreeData from "./treeData/htmlTreeData";
import cssTreeData from "./treeData/cssTreeData";

const treeData = [htmlTreeData, cssTreeData];

const treeView = toTreeView(treeData);

export default treeView;
