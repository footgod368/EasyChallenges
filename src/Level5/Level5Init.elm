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
            , levelBoundary = ( 30 * 40, 1680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.hitBlock 1 "wings" (1,1) (1,1)
                    ]
            , boundary = Boundary.normalInit
            , player =
                Player.init ( 50.0, 290.0 ) Player.defPlayerProperty (Player.ChangeTo newProperty 1 Player.NoNextPropertyChange )
            , bricks =
                Array.fromList
                    (List.concat
                        [ Brick.initRow 10 1 5
                        , Brick.initRow 10 13 20
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 9 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 89, 14 ))
            , noticeBoards =
                Array.fromList
                    [ 
                    ]
            , needles =
                Array.fromList
                    ([

                    ]
                    )
            , keyPressed = []
            , gameControl = GameControl.init MainType.Level5
            , mainScene = MainType.Level5
            , number = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
