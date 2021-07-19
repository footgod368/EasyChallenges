module Level5.Level5Init exposing (init)

{-| Init of Level5 Model.


# init

@docs init

-}

import Array
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Level5.Level5Type as Level5Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Task
import Modules.Player exposing (Player)
import Modules.Brick exposing (Brick)
import Modules.Event exposing (hitBlock)


{-| `init` of Level5 \`Model
-}
init : () -> ( Level5Type.Model, Cmd MainType.Msg )
init a =
    let
        tempProperty = Player.defPlayerProperty
        newProperty = {tempProperty | playerJumpNum = 999999
                                    , ifPlayerJumpOnTheGround = False}
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 60 * 40, 40*40.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.hitBlockAfter 1 "wings" (3,36) (1,1) 3
                    , Event.hitLineSeg 2 "first needle" (GlobalBasics.blockPosFloat (5,39.9)) (GlobalBasics.blockPosFloat (18,39.9))
                    , Event.hitLineSeg 3 "first ?" (GlobalBasics.blockPosFloat (3.05,38.01)) (GlobalBasics.blockPosFloat (3.95,38.01))
                    ]
            , boundary = Boundary.normalInit
            , player =
                Player.init ( 50.0, 290.0 ) Player.defPlayerProperty (Player.ChangeTo newProperty 1 Player.NoNextPropertyChange )
            , bricks =
                Array.fromList
                    (List.concat
                        [ Brick.initRow 10 1 5
                        , [Brick.initPosVolumeColor  (GlobalBasics.blockPosFloat (13,10)) (40*40,10*40) "#00000050"]
                        , Brick.initRow 40 1 60
                        , [Brick.initPosVolumeColor (GlobalBasics.blockPosFloat (3,37)) (40,40) "#FFFF00"]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 3, 36 ))
                                (Brick.Detailed 40 40 "	#778899")
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 3 (GlobalModule.InvisibleAfterEvent 1 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        , [NoticeBoard.boundary (6,2) (6,4)]
                        , let
                                tempBoard1 = NoticeBoard.boundary (5.8,32) (6.2,2.2)
                          in
                          [{tempBoard1 | visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 2  GlobalModule.NoNextVisibility)}]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 9 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 89, 14 ))
            , noticeBoards =
                Array.fromList
                    [ NoticeBoard.quickInit (GlobalBasics.blockPosFloat (3.5,37.8)) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat (9,3.8)) "Do not" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat (9,4.8)) "jump down" 40
                    , let
                            tempNotice = NoticeBoard.quickInit (GlobalBasics.blockPosFloat (9,33.2)) "As I said ^_^" 40  
                      in
                      {tempNotice | noticeBoardVisibility = NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 2 "As I said ^_^" NoticeBoard.NoNextNoticeBoardVisibility)}
                    ]
            , needles =
                Array.fromList
                    (
                    List.concat
                    [
                        Needle.initHiddenRow 39.9 5 17 2
                    ]
                    )
            , keyPressed = []
            , gameControl = GameControl.init MainType.Level5
            , mainScene = MainType.Level5
            , number = []
            }
    in
    ( newModel , Task.perform MainType.GetViewport getViewport )
