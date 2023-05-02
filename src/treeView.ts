import toTreeView from "./utils/toTreeView";
import htmlTreeData from "./contents/treeData/htmlTreeData";
import cssTreeData from "./contents/treeData/cssTreeData";

const treeData = [htmlTreeData, cssTreeData];

const treeView = toTreeView(treeData);

export default treeView;
