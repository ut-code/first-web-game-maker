import toTreeView from "./utils/toTreeView";
import htmlTreeData from "./contents/treeData/htmlTreeData";
import cssTreeData from "./contents/treeData/cssTreeData";
import pacmanTreeData from "./contents/treeData/pacmanTreeData";

const treeData = [htmlTreeData, cssTreeData, pacmanTreeData];

const treeView = toTreeView(treeData);

export default treeView;
